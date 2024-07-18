import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterChat'
  })
  export class FilterChatPipe implements PipeTransform {
    transform(chatRooms: any[], searchText: string): any[] {

        console.log("InsidePipe",searchText);
      if (!chatRooms) return [];
      if (!searchText) return chatRooms;
  
      searchText = searchText.toLowerCase();
      return chatRooms.filter(chat => {

        console.log("EnChat::", chat);
    
        return (chat.friend_first?.full_name.toLowerCase().includes(searchText)|| false)
            || (chat.friend_second?.full_name.toLowerCase().includes(searchText)|| false)
            || (chat.group_chat && chat.group_chat?.full_name.toLowerCase().includes(searchText)|| false);
      });
    }
  }