# domdomDOM

domdomDOM is a JavaScript library that is designed to simplify client-side scripting of HTML.
It is designed to make it easier to navigate a document, select the DOM elements, handle events, and create
asynchronous JavaScript applications.

domdomDOM was written in JavaScript with a testing example written in HTML.
The test connects to a weather API to test the AJAX call feature.

Anything you had to stop and think about before building
To build the AJAX request feature it was necessary to build a helper function to structure the query string. This string was created using the data section of the AJAX request being submitted. From there, XMLHttpRequest functions were used to load the AJAX request and check the status.

In the future, it would be good to exemplify the features of domdomDOM by creating a simple game, such as snake. I believe it would also be beneficial to have the AJAX request return a promise.
