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

1-4-1/1101.png##121 ##22~~13~~－11

1-4-1/1102.png##36 ##12~~8~~－36

1-4-1/1103.png##64 ##12~~7~~1

1-4-1/1104.png##625 ##20~~9~~1

1-4-1/1105.png##100000 ##10000~~50~~15

1-4-1/1106.png##－27 ##－9~~0~~－6

1-4-1/1107.png##36 ##－36~~－4~~－12

1-4-1/1108.png##1 ##－1~~－50~~50

1-4-1/1109.png##－81 ##－18~~18~~81

1-4-1/1110.png##－1000 ##－30~~－13~~1000





-----*/}.toString().replace(/\r/g,"").slice("function(){/*--這一行請勿更改--".length+1,-9);



/******************************************************************
 以下為程式碼, 不要更動
 ******************************************************************/
getOneQuestion = function(tools) {
	return tools.getOneQuestion(question_lines, [seperator, seperator2]);
};

