# RecruitmentTask

# Instalation
```
git clone https://github.com/ppiotr191/recruitmentTask.git
composer install
yarn install
```
# Database
First, add .env file based on .env.dist  

```
 php bin/console doctrine:database:create
 php bin/console doctrine:migration:migrate
```
# Run
```
yarn encore dev --watch
symfony server:start
```
# Default admin
```
login    : admin@admin.pl
password : admin@admin.pl
```
