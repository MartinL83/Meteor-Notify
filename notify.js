// A simple Notifier boilerplate.
// Adds notifications to a collection.
var notifyConstructor = (function(){

  function Notify(settings){
    // If no settings arguments, add a empty object to this.settings.
    if ( !settings ) {
      this.settings = {}
    }

    // Fill in default values to this.settings.
    _.defaults(this.settings, this.defaultSettings);

    // Setup the collection.
    this.notifications = new Mongo.Collection(null);
  };

  // Default settings for notifications
  Notify.prototype.defaultSettings = {
    expire: 2000,
  };

  // Create the message object to add to the collection.
  Notify.prototype.add = function(message){
    var notification = {};

    // You need to add a title OR a message.
    if (!message.title && !message.message) {
      throw new Meteor.Error("notify.error", "Error", "You need to add either a title or a message.");
    }

    // Build the notification object.
    notification.createdAt    = new Date();
    notification.title        = message.title;
    notification.message      = message.message;
    notification.type         = message.type ? message.type : 'message';
    notification.position     = message.position ? message.position : 'top'

    if ( message.expireAt || message.expireAt === 0 ) {
      notification.expireAt   = message.expireAt
    }
    else {
      notification.expireAt   = this.settings.expire
    }

    // Send new notification object to the addToCollection function.
    return this.addToCollection(notification);
  };

  // Actually inserts the notification in to the local collection.
  Notify.prototype.addToCollection = function(notification){
    //Insert document in to collection.
    var note = this.notifications.insert(notification);

    // Get the expire time in milliseconds from the newly inserted document.
    var expire = this.notifications.findOne({_id:note}).expireAt;

    var self = this;


    // Remove the notification after expired time.
    // If expireAt is set to 0, don´t call self.remove.
    if (expire !== 0) {
      Meteor.setTimeout(function(){
        self.remove(note);
      },expire);
    }

    // Return document (id).
    return note;
  };

  // Removes a notification by ID from the local collection.
  Notify.prototype.remove = function(id){

    // Remove the notification from collection.
    this.notifications.remove({_id:id});

  };

  return Notify;

})();

Notify = new notifyConstructor();

/*
Example usage

Add a notification.
Notify.add({
  title: 'My title, optional',
  message: 'A message, optional',
  expireAt: 6000
});

The functionn always return the ID of the note.
