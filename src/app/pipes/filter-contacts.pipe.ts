import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterContacts'
  })
  export class FilterContactsPipe implements PipeTransform {
    transform(users_contacts: any[], searchText: string): any[] {

        console.log("InsidePipeContacts",users_contacts);
      if (!users_contacts) return [];
      if (!searchText) return users_contacts;
    
      searchText = searchText.toLowerCase();
      return users_contacts.filter(chat => {

        console.log("EnChat::", chat);
    
        return (chat.name.toLowerCase().includes(searchText)|| false)
          //  || (chat.friend_second?.full_name.toLowerCase().includes(searchText)|| false)
           // || (chat.group_chat && chat.group_chat?.full_name.toLowerCase().includes(searchText)|| false);
      });
    }
  }