"""rename visited_at and updates_at in VisitedPark

Revision ID: 4c15781d7b6c
Revises: 643772972892
Create Date: 2025-12-19 07:39:12.152138

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4c15781d7b6c'
down_revision: Union[str, Sequence[str], None] = '643772972892'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "visited_parks",
        "visited_at",
        new_column_name="visited_date"
    )

    op.alter_column(
        "visited_parks",
        "updated_at",
        new_column_name="updated_date"
    )


def downgrade() -> None:
    op.alter_column(
        "visited_parks",
        "visited_date",
        new_column_name="visited_at"
    )

    op.alter_column(
        "visited_parks",
        "updated_date",
        new_column_name="updated_at"
    )
