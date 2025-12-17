"""add visited parks

Revision ID: dcf0a4138729
Revises: 3bd496417bf8
Create Date: 2025-12-17 07:26:02.786555

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dcf0a4138729'
down_revision: Union[str, Sequence[str], None] = '3bd496417bf8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "visited_parks",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("park_id", sa.UUID(), sa.ForeignKey("parks.id", ondelete="CASCADE")),
        sa.Column("rating", sa.Integer(), nullable=True),
        sa.Column("review", sa.Text(), nullable=True),
        sa.Column("visited_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.UniqueConstraint("user_id", "park_id", name="uq_user_park_visit"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    pass
