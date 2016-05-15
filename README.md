# Meteor-Notify
A simple notification boilerplate for [Meteor] (https://github.com/meteor/meteor). Using Meteor´s functionality.

MIT License
Copyright (c) 2016 Martin Lindgren

#### Usage
In notify.js a new constructor is made called "Notify". Simply import notify.js anywhere in your project and you are (almost) ready to go.

**Step 1**
Create a notification.
```
Notify.add({
  title: 'My title, optional',
  message: 'A message, optional'
});
```
This will add a new notification to the local notifications collection. By default it will expire in 2000 milliseconds. When it expires it will automaticly get deleted from the collection.

**Step 2**
You will need to roll your own template code. This depends on the template engine you are using. For example in Blaze:
```
Template.Notify_Wrapper.helpers({
  notifications: function(){
    return Notify.notifications.find();
  }
});
```
Then in your HTML
```
<template name="Notify_Wrapper">
  {{#if notifications}}
  <div id="notifications">
    {{#each notifications}}
        {{> Notification}}
    {{/each}}
  </div>
  {{/if}}
</template>

<template name="Notification">
  <div class="notification notification-type" id="notification-{{_id}}">
    {{#if title}}
      <strong>{{title}} </strong>
    {{/if}}
    {{#if message}}
      <span>{{message}}</span>
    {{/if}}
  </div>
</template>
```

**Step 3**

You will also have to roll your own CSS styles.
