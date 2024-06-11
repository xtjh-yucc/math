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

歡喜冤家##似相怨而實相愛的戀人或夫妻。##1-18;1-6;0;1-10
賓至如歸##客人來到這裡就好像回到自己的家裡。##1-3;1-6;0;1-10
賓主盡歡##主﹑客間相聚融洽，都能盡興﹑歡愉。##1-3;1-5;1-9;1-18
守口如瓶##嘴巴像瓶口一樣封得緊密。比喻嚴守祕密。##1-3;1-3;0;1-6
=====本題結束

一心一意##專心致志,不分心。##0;1-2;0;1-5
一意孤行##固執己見,不聽勸告。##0;1-5;1-3;1-3
行雲流水##形容動作敏捷,不受拘束。##3;1-8;1-3;0
水落石出##比喻事情的真相顯露出來。##0;1-6;1-2;1-3
=====本題結束

魚目混珠##比喻用假的東西冒充真的東西。##1-7;1-2;1-7;1-4
目不轉睛##形容注意力集中，看得很仔細。##1-2;1-2;1-7;1-5
如魚得水##比喻得到跟自己很合適的環境或幫助。##1-3;1-7;1-3;0
求之不得##形容非常渴望得到。##1-2;1-2;1-2;1-3

=====本題結束

一心一意##全心全意地專注於某件事。##0;1-2;0;1-5
一見如故##初次見面就像老朋友一樣。##0;1-5;1-3;1-5
如魚得水##比喻得到跟自己很合適的環境或幫助。##1-3;1-6;1-3;0
水落石出##比喻事情真相大白。##0;1-7;1-2;1-3

=====本題結束

兵荒馬亂##形容戰爭所造成的混亂景象。##0;1-4;1-10;1-12
兵家常事##很平常的事情。##0;1-3;1-5;1-8
貴人多忘事##形容人記性不好，容易忘記事情。##1-5;1;1-3;1-3;1-8
歡喜冤家##似相怨而實相愛的戀人或夫妻。##1-18;1-3;1-10;1-3

=====本題結束

棄若敝屣##像扔掉破鞋一樣的拋棄。後用以比喻毫不可惜。##1-3;1-9;1-7;1-3
始亂終棄##男子誘惑女子做出違背禮法的行為，最後卻將她棄而不顧。##1-3;1-12;1-6;1-3
始作俑者##最初製作人俑來殉葬的人。後世用以比喻首創惡例的人。##1-3;1-2;1-9;1-4

-----*/}.toString().replace(/\r/g,"").slice("function(){/*--這一行請勿更改--".length+1,-9);