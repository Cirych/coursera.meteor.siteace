/* global Websites */
/* global Websites */

Websites = new Mongo.Collection("websites");
// set up security on Images collection
Websites.allow({
	insert(userId, doc){ 
    if (Meteor.user()){ 
      return true; 
    } else { 
      return false; 
    } 
  },
  update(userId, doc){ 
    if (Meteor.user()){ 
      return true; 
    } else { 
      return false; 
    } 
  },
	remove(userId, doc){ 
    if (userId){ 
      return true; 
    } else { 
      return false; 
    } 
  }
})