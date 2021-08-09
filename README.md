# Rebate Calculator project

This project is to build for Rebate Calculator project

# Run frontend

docker-compose exec frontend sh -c "yarn start"

# Run Backend

docker-compose exec app sh -c "python manage.py makemigrations && python manage.py migrate && python manage.py initdb && python manage.py collectstatic --no-input && python manage.py runserver 0.0.0.0:8000"

# Make data in prostgres on root user to access

sudo chown -R 1000:1000 ./data

