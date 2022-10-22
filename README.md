# Igrannonica

## Kratak opis projekta

Igrannonica je Veb aplikacija za izučavanje osnovnih principa funkcionisanja veštačkih neuronskih mreža kroz interaktivan
rad.

## Demo

Demo aplikacije se može pronaći na sledećem [linku](softeng.pmf.kg.ac.rs:10081).

Korišćeni portovi:
* [backend](softeng.pmf.kg.ac.rs:10080): 10079
* [frontend](softeng.pmf.kg.ac.rs:10081): 10081
* [mikroservis](softeng.pmf.kg.ac.rs:10082/docs): 10082
* postgresSQL: 5432

## Potrebni paketi i programi

* .NET 6
* node `v16.14.0`
* npm `8.3.1`
* Angular CLI `13.2.5`
* PostgreSQL `14.2`
* Python `3.10`
* Pip
* Pipenv `2022.1.8`


## Pokretanje na (linux) serveru

Podrazumeva se da je trenutni radni direktorijum lični direktorijum tima.

**Napomena**: za prikaz svih procesa koji su pokrenuti od korisnika `Regresis` moguće je koristiti komandu:
```
myproc
```

#### Pokretnje frontend-a
 ```
cd deployment/front
node app.js &
 ```

#### Pokretnje mikroservisa
 ```
cd ../ann
pipenv run server &
 ```
 
#### Pokretanje backend-a
```
cd ../back
./backend &
```

## Uputstvo za build-ovanje
### Instalacija

1. Instaliranje [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)-a
2. Preuzimanje projekta. Može se izvršiti preko komande linije na sledeći način:  
    `git clone http://gitlab.pmf.kg.ac.rs/igrannonica/regresis.git`
3. Instaliranje [nodejs](https://nodejs.org/dist/v16.14.0)-a
4. Instaliranje Angular-a:  
    `npm install -g @angular/cli`
3. Instaliranje paketa za frontend:  
    ```
    cd regresis
    cd src
    cd frontend
    npm install .
    ```
4. Instaliranje [PostgreSQL](https://www.postgresql.org/download)-a  
    **Npgsql driver** se na Windows sistemima može instalirati čekiranjem opcije `Npgsql v3.2.6-3` u kategoriji _Database Drivers_ Stack Builder-a
5. Instaliranje [Python](https://www.python.org/downloads/release/python-3102)-a (ako se [pip](https://pypi.org/project/pip) ne instalira potrebno je i njega instalirati)
6. Instaliranje `pipenv`-a:  
    `pip install pipenv`
7. Instaliranje potrebnih python paketa:  
    ```
    cd ..
    cd ann-microservice
    pipenv install .
    ```
    **Napomena**: podrazumeva se da nije bilo promena radnog direktorijuma i međuvremenu. Poslednju komandu je potrebno izvršiti u `ann-microservice` folderu
    
### Pokretanje

Nakon instalacije svih potrebnih programa i paketa projekat se može pokrenuti.

#### Pokretnje frontend-a
 ```
cd src
cd front
ng serve --open
 ```

#### Pokretnje mikroservisa
 ```
cd ..
cd ann-microservice
pipenv run server
 ```
 
#### Pokretanje backend-a
```
cd ..
cd backend
dotnet run
```


## Za developere

Za učesnike u razvoju kreiran je [referencni fajl](docs/internal/reference.md) koji sadrži sve bitne informacije za razvoj aplikacije.