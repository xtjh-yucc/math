﻿//
//開始比賽前, 說明對話框的說明文字
//
helpText = "請找合適的答案。兩邊都按GO以後開始PK";

//*************************************************************************
//題庫
//*************************************************************************
//	類型1：每一行中就有題幹、正確選項和多個錯誤的選項 (三個欄位的題庫)
//*************************************************************************
//	格式說明：
//	1.用「半形分號」分隔了題幹、正確選項和錯誤選項
//	  [例]
//		  "題幹;正確選項;錯誤選項"			<---第一行
//		, "題幹;正確選項;錯誤選項"			<---第二行以後的(前面多了逗號)
//
//	2.錯誤選項有多個，用「半形逗號」再隔開
//	  [例]
//		  "題幹;正確選項;錯誤1,錯誤2,錯誤3,錯誤4,"
//
//*************************************************************************
//	類型2：每一行只有題幹和正確選項而已 (二個欄位的題庫)
//		   錯誤選項的部份由程式自動產生
//*************************************************************************
//	格式說明：
//	1.用「半形分號」分隔了正確選項和題幹
//	  [例]
//		  "題幹;正確選項"			<---第一行
//		, "題幹;正確選項"			<---第二行以後的(前面多了逗號)
//
//  底下的範例
//		1.採用二欄式的題庫
//		2.有使用「分數」的表示式，可以由程式製作帶有「分數」的數學式
//		3.有使用「直式注音」的表示式
//		4.有使用圖片
//
//		[例]
//			[1:3] 	會顯示「三分之一」的數學符號
//			[1:2:3] 會顯示「一又三分之二」的數學符號
//
question_lines = new Array(
//-------------------以下開始貼您的題庫--------------------------
 "3-2/12001.png;是"
, "3-2/12002.png;否"
, "3-2/12003.png;xy＝96"
, "3-2/12004.png;反比"
, "3-2/12005.png;xy＝12" 
, "3-2/12006.png;6"
, "3-2/12007.png;xy＝9"
, "3-2/12008.png;－3"
, "3-2/12009.png;xy＝-54"
, "3-2/12010.png;－18"
, "3-2/12011.png;3-2/2011.png"
, "3-2/12012.png;3-2/2012.png"
, "3-2/12013.png;3-2/2013.png"
, "3-2/12014.png;3-2/2014.png"
, "3-2/12015.png;xy＝1200"
, "3-2/12016.png;40"
, "3-2/12017.png;xy＝3600"
, "3-2/12018.png;4"
, "3-2/12019.png;xy＝40"
, "3-2/12020.png;5"


//-------------------題庫結束------------------------------------
);





//基本設定
optionsTotal = 6;		//共有幾個選項
optionColTotal = 3;		//一列有幾個選項


/******************************************************************
 以下為程式碼, 不要更動
 ******************************************************************/
getOneQuestion = function(tools) {
	return tools.getOneQuestion(question_lines);
};
