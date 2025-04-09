# Server methods needed

## All users (admins, sellers, customers):

-   signup
-   login (use bcrypt for password hashing)
-   search (similar to irtaimistorekisteri)
    -   add relevance sorting as default (R4)
-   get book by bookId
-   get schema
-   set contact info

## Only admins and sellers:

-   create book
-   update book
-   delete book

## Only customers:

-   reserve book -> status to reserved -> 10min client 20min server reservation
    -   calculate shipping and total
    -   show order summary
-   cancel reservation
    -   status to available
    -   delete pending order
-   buy book (confirm reservation) -> status to sold
    -   return success
-   get my orders

## Only admins:

-   reports
    -   preferably all in csv
    -   R2 -> unsold books
    -   R3 -> customer orders
