import requests
from bs4 import BeautifulSoup
import base64
from sqlalchemy.orm import Session
from typing import Optional, Tuple
import logging
from urllib.parse import urljoin
from app.db import SessionLocal
from app.models.park import Park

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def fetch_image_as_base64(url: str) -> Optional[str]:
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        return base64.b64encode(resp.content).decode("utf-8")
    except Exception as e:
        logging.warning(f"Failed to fetch image {url}: {e}")
        return None


def scrape_park_page(url: str) -> Tuple[Optional[str], Optional[str]]:
    try:
        resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        resp.raise_for_status()
        soup = BeautifulSoup(resp.content, "lxml")

        description = None
        cover_image = None

        # ======================
        # CASE 1: Raleigh
        # ======================
        intro_div = soup.select_one("div.c-intro")
        if intro_div:
            parts = [
                tag.get_text(strip=True)
                for tag in intro_div.find_all(["p", "li"])
                if tag.get_text(strip=True)
            ]
            description = "\n".join(parts) if parts else None

            img_tag = soup.select_one("img.media__element")
            if img_tag and img_tag.get("src"):
                image_url = urljoin(url, img_tag["src"])
                cover_image = fetch_image_as_base64(image_url)

            return description, cover_image

        # ======================
        # CASE 2: Durham
        # ======================
        slider_img = soup.select_one("ol.cpSlider li img")
        if slider_img and slider_img.get("src"):
            image_url = urljoin(url, slider_img["src"])
            cover_image = fetch_image_as_base64(image_url)

        editor_div = soup.select_one("div.editorContent")
        if editor_div:
            direct_text = editor_div.find_all(string=True, recursive=False)
            cleaned = [t.strip() for t in direct_text if t.strip()]
            description = "\n".join(cleaned) if cleaned else None

        if description or cover_image:
            return description, cover_image
    
        # ======================
        # CASE 3: Wake County
        # ======================
        paladin_article = soup.select_one(
            "#block-paladin-content article"
        )

        if paladin_article:
            rows = paladin_article.select("div.row")

            for row in rows:
                p = row.find("p")
                if p and p.get_text(strip=True):
                    description = p.get_text(strip=True)
                    break

            for row in rows:
                img = row.find("img")
                if img and img.get("src"):
                    image_url = urljoin(url, img["src"])
                    cover_image = fetch_image_as_base64(image_url)
                    break

        return description, cover_image
    


    except Exception as e:
        logging.warning(f"Failed to scrape {url}: {e}")
        return None, None



def scrape_all_parks(db: Session, batch_size: int = 10):
    parks = db.query(Park).all()

    for i, park in enumerate(parks, 1):
        if not park.website:
            continue

        logging.info(f"Scraping {park.name} ({i}/{len(parks)})...")
        description, cover_image = scrape_park_page(park.website)

        if description:
            park.description = description
        if cover_image:
            park.cover_image = cover_image

        db.add(park)

        if i % batch_size == 0:
            db.commit()

    db.commit()
    logging.info("Finished scraping all parks.")


def main():
    db: Session = SessionLocal()
    try:
        scrape_all_parks(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
