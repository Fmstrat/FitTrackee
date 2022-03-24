"""add ascent record

Revision ID: cd0e6cf83207
Revises: e30007d681cb
Create Date: 2022-03-22 20:21:13.661883

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cd0e6cf83207'
down_revision = 'e30007d681cb'
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        """
        ALTER TYPE record_types ADD VALUE 'HA';
        """
    )

def downgrade():
    op.execute("ALTER TYPE record_types RENAME TO record_types_old")
    op.execute("CREATE TYPE record_types AS ENUM('AS', 'FD', 'LD', 'MS')")
    op.execute(
        """
        ALTER TABLE records ALTER COLUMN record_type TYPE record_types 
        USING record_type::text::record_types
    """
    )
    op.execute("DROP TYPE record_types_old")
