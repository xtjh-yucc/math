﻿//
//開始比賽前, 說明對話框的說明文字
//
helpText = "請找合適的答案。";

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
 "有三數成等比數列，已知數列的第2項為3，則此三數的乘積為何？;27"
, "有三數成等比數列，已知數列的第2項為8，則此三數的乘積為何？;512"
, "有三數成等比數列，已知數列的第2項為－5，則此三數的乘積為何？;-125"
, "有三數成等比數列，已知數列的第2項為－1，則此三數的乘積為何？;-1"
, "有一等比數列共有5項，已知數列的第3項為－9，則此數列首項與末項的乘積為何？;81"
, "有一等比數列共有9項，已知數列的第5項為7，則此數列首項與末項的乘積為何？;49"
, "有一等比數列共有11項，已知數列的第6項為－6，則此數列首項與末項的乘積為何？;36"
, "有一等比數列共有15項，已知數列的第8項為10，則此數列首項與末項的乘積為何？;100"

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