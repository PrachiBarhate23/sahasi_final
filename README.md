"Frontend"
npx expo start 
android 'a' for emulator or for phone scan QR
for reloading 'r'

"Backend"
start python environment
start docker desktop

terminal 1-
cd backend
cd sahasi-backend
docker start sahasi-postgres
python manage.py runserver 0.0.0.0:8000

terminal 2-celery-
  python -m celery -A sahasi worker -l info -P solo

terminal 3 -redis-
docker start redis
docker exec -it redis redis-cli ping ----output should be PONG


optional terminal 4-(if you are using tunnel)
 npx localtunnel --port 8000 
 copy url to api_base_url in api.js

 otherwise just add your ip address in allowed hosts and run directly without tunnel
