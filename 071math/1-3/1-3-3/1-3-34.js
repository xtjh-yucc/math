﻿//=======================================================
// HTML5 FUN 題庫設定檔 PK (三欄式題庫)
//=======================================================

//基本設定
//------------------------------
//共有幾個選項
//------------------------------
optionsTotal = 4;		

//------------------------------
//一列有幾個選項(pk, 王牌投手用)
//------------------------------
optionColTotal = 4;		

//------------------------------
//開始比賽前,說明對話框的說明文字
//------------------------------
helpText = "請找出空格較合適的語詞。大家都按GO以後開始PK";


//---------------------------------------------------
// [題庫]
//---------------------------------------------------

//------------------------------
//欄位分隔符號為兩個井字號(##)
//------------------------------
seperator = '##';

//------------------------------
//多個選項的分隔符號
//------------------------------
seperator2 = '~~';

//
//[題目設定]
//  一行一題, 
//  三欄式題庫，每一題以欄位分隔符號(##)分隔為三欄
//    [例] 題幹##正確選項##錯誤選項
//
//  正確選項及錯誤選項可再利用選項分隔符號(~~)分隔多個
//    [例] 題幹##正確1~~正確2##錯誤1~~錯誤2~~錯誤3
//
//
question_lines = function(){/*--這一行請勿更改--


(－49)÷(－7)×5＝？##35 ##－35~~－11.2~~11.2

 56÷28×(－22)＝？## －44 ##44~~－20~~20


(－12)÷(－6)×(－49)＝？ ##－98 ## 98 ~~－47~~－51

(－17)－(－8)÷(－2)＝？##－21 ##－4.5~~4.5~~21

(－3)×(－10)＋5×(－13)＝？##－35 ##－95~~95~~35







-----*/}.toString().replace(/\r/g,"").slice("function(){/*--這一行請勿更改--".length+1,-9);



/******************************************************************
 以下為程式碼, 不要更動
 ******************************************************************/
getOneQuestion = function(tools) {
	return tools.getOneQuestion(question_lines, [seperator, seperator2]);
};
