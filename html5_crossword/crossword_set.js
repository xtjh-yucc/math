//=======================================================
// HTML5 FUN 題庫設定檔 Crossword填字遊戲
//=======================================================

//-------------------------------
//欄位分隔符號
//-------------------------------
fields_seperator = '##';

//-------------------------------
//國字分隔符號: 用來將不同字的筆畫
//-------------------------------
words_seperator = ';';

//-------------------------------------------------
//語詞、提示(解釋)、例句及每個字要顯示的筆畫。
//-------------------------------------------------

//
//[題目設定]
//
//	每一題組使用多行，
//	每一行代表一個成語，
//
//  包括: 語詞、提示(解釋)、例句及每個字要顯示的筆畫。
//
//  　一行接一行，
//  　該題結束就填入: =====本題結束
//  　下一行即是新的一題
//
//  每一行可以有三個欄位，以 [欄位分隔符號] ## 來分隔。
//
//  　第一個欄位 : 成語，
//  　第二個欄位 : 解釋(提示, 可以為空的)
//  　第三個欄位 : 要顯示的筆畫(國字筆順,英文題用不到)
//  　　不同字間的筆畫用 [國字分隔符號] 分號來分隔，
//  　　例如: 1-5 表示只出現1至5畫
//  　　0 為不顯示任何筆畫。
//
questionLines = function(){/*--這一行請勿更改--

六馬仰秣##形容馬兒吃飽了草料，仰頭嘶鳴的樣子，常用來比喻兵馬整頓完畢，隨時準備出發。##1-2;1-6;1-5;1-10
仰不愧天##抬頭無愧於天，形容為人光明磊落，問心無愧。##1-5;1-3;1-8;1-2
天經地義##指絕對正確的道理，理所當然的事。##1-2;1-6;1-5;1-7

=====本題結束

陽春白雪##原指戰國時代楚國一種高雅的歌曲，後來比喻高深的藝術作品或學問。##1-7;1-5;1-3;1-8
白璧無瑕##比喻人或事物完美無缺，沒有任何缺點。##1-3;1-13;1-8;1-12
瑕不掩瑜##比喻人或事物雖有缺點，但整體來說仍然是好的。##1-12;1-4;1-10;1-12



=====本題結束

下里巴人##原指戰國時代楚國的民間通俗歌曲，後來比喻通俗的文藝作品或普通大眾。##1-3;1-5;1-3;1-1
人山人海##形容人非常多，非常擁擠。##1-1;1-3;1-1;1-3
海闊天空##形容天地遼闊，沒有束縛，比喻心境開闊，思慮無拘無束。##1-3;1-7;1-4;1-5
天真爛漫##形容孩子的心地單純，性格直率，也形容自然景色的美好。##1-4;1-8;1-11;1-7


-----*/}.toString().replace(/\r/g,"").slice("function(){/*--這一行請勿更改--".length+1,-9);
