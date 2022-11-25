import { BoardMessage } from './../../bean/BoardMessage';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn : 'root'
})

export class BoardChatStore{
 public boardMap:Map<number,BoardMessage[]>=new Map();

 

/*
sub program
1.အရင်ဆုံးmesaage အကုန်ထုတ်ပြမယ်?
2.စာပို့မယ်
3.စာပို့လိုက်ရင်ဟိုဘက်ကနေ reactive ဖြစ်ရမယ်


1.socket ထဲ getAllmessage နဲ့ထုတ်ပြမယ် အဲ့ခါ message ထဲမှာရောက်နေမယ် (မှန်သွားပြီ)
or
စာပို့လိုက်ရင် subscribe ထဲမှာ message ရလာမယ် အဲ့ message ကို boardMap ထဲထည့်မယ်

အဲ့ဒါကိုပြန်ထုတ်ပြရင် boardId နဲ့ထုတ်တဲ့ကောင်ကိုထုတ်ပြ ပြီးရင် message ထဲကိုထည့်ပြီးpush လုပ်မယ်

*/


}