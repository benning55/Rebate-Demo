# Inventory Material

This project is to build for Inventory Material project.

# Run frontend

docker-compose exec frontend sh -c "yarn start"

# Run Backend

docker-compose exec app sh -c "python manage.py makemigrations && python manage.py migrate && python manage.py initdb && python manage.py collectstatic --no-input && python manage.py runserver 0.0.0.0:8000"

# Make data in prostgres on root user to access

sudo chown -R 1000:1000 ./data

# Run frontend build script

```
sudo chmod 755 run-local.sh
```

```
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0058_auto_20210720_1936'),
    ]

    operations = [
        migrations.RunSQL(
            'ALTER SEQUENCE core_order_id_seq RESTART WITH 1610;'
        )
    ]
```
