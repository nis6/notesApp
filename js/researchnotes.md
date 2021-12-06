-Window.localStorage property, to access localstorage of browser (an SQLite file)
-stores only strings
    -JSON.stringify
    -JSON.parse

#setItem(): Add key and value to localStorage
#getItem(): This is how you get items from localStorage
#removeItem(): Remove an item by key from localStorage
#clear(): Clear all localStorage
#key(): Passed a number to retrieve the key of a localStorage

-LocalStorage 
should be avoided because it is synchronous and will block the main thread. It is limited to about ##5MB and can contain only strings. LocalStorage is not accessible from web workers or service workers.


-IndexedDB and the Cache Storage API 
are supported in every modern browser. They're both asynchronous, and will not block the main thread. They're accessible from the window object, web workers, and service workers, making it easy to use them anywhere in your code.

#NotesView
-constructor renders the UI in dom/browser
-so eventlisteners inside view constructor to bind them at the time of instantiation
- 






<!-- TODO-S -->
1. add color themes
- 