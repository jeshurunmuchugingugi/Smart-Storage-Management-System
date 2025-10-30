"""add paid status to booking

Revision ID: add_paid_status
Revises: 2ebafec72d23
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_paid_status'
down_revision = '2ebafec72d23'
branch_labels = None
depends_on = None


def upgrade():
    # Add 'paid' to booking_status enum
    op.execute("ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'paid'")


def downgrade():
    # Note: PostgreSQL doesn't support removing enum values easily
    # This would require recreating the enum type
    pass
