https://onemillionchacters.com

# how to run the app
## How to run this demo

```bash
npm install
```
# Follow setup of [y-sweet.cloud/docs setup](https://y-sweet.cloud/quickstart) to get your connection string
# create .env file with 
```bash
echo "CONNECTION_STRING=<YOUR_CONNECTION_STRING>" > .env
```
```bash
npm run dev
```
### In another terminal
```bash
npm run server
```
### if `npm run server` fails you need a [y-sweet.cloud](https://y-sweet.cloud/quickstart) api key. ex:  `yss://......../`
```bash
CONNECTION_STRING=<your-connection-string> npm run server
```
## Open [localhost:3000](http://localhost:3000) in your browser.
![alt text](image.png)
## Success!

----

# Dev log
##  version 1
![alt text](img/image.png)

# v2 missing live count down
![alt text](img/image-1.png)

a step backwards
![alt text](img/image-2.png)

# working on the interface
![alt text](img/image-3.png)

# i like the idea of the buttons for each letter (and optional advaced users do )
![alt text](img/image-4.png)
- add press button to set chacter
- add charset [A-Z 0-9 Space \,]
- add confitty on send 
- make text box red when confirmed
- start send grayed out and when confirmed is pressed hit send

# wow that looks great
![alt text](img/image-5.png)
- remove A-Z only a-z
- popup when send is pressed and timer is not 0 minutes say "Please wait until you can add you next chacter"
- make count down time really big
- if the chacter set
- add a reset button : allow reset if send is not clicked
- 

- ![alt text](img/image-6.png)
- 'confirm, reset, send (size huge)'
-

![alt text](img/image-7.png)
- changed wait timer to 10 seconds

- add delete chacter button
- make delete chacter add 30 seconds the the timer
- add a note saying "delete adds 30 seconds to the timer, send adds 10"






- add display as qwerty format
qwertyuiopasdfghjklzxcvbnm ,0123456789



![alt text](img/image-8.png)

![alt text](img/image-9.png)
- fix counting in seconds
- merge confirm and send 
- change confirm button into send button when clicked
- when confirm button is pressed display are you sure?
- change delete button to disabled when counter is above 0 seconds 

![alt text](img/image-10.png)
- change reset to undo
- change confirm button to Submit (every 10 second)
- change detete chacter  button to "delete character (adds 20 seconds)

![alt text](img/image-11.png)
- change undo button to disabled when counter is above 0 seconds  
- always count down the timer every second

# try number 2
![alt text](img/image-12.png)
- fix qwert 

![alt text](img/image-13.png)
- set deault to 0
- please wait <wait_count>
- on submit add to wait_count + 10 seconds
![alt text](img/image-14.png)
- 

![alt text](img/image-15.png)
- simplify disable
![alt text](img/image-16.png)
![alt text](img/image-17.png)
- i like the organization of the rows better
![alt text](img/image-18.png)
- looks like shit but works

![alt text](img/image-19.png)
- padding needs to be fixed
![alt text](img/image-20.png)
- size needs to be fixed


# went a different direction
![alt text](img/image-21.png)
- missing char input keyboard

![alt text](img/image-22.png)
- workds but has weird user flow around entering
- fix coloring issue with boxes
# TODO

- first row 10, second row 9, third row 
- add big COUNTER NUMBER OF CHACTERS left

- todo add fancy slight rotate when mouse hovers over letter select box
- add sound effect when select box
- add big sound effect when send
- add confitty!



# License MIT @ oran collins 2024