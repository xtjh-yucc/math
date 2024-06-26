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
 "已知3 , x , 9成等比數列，求3與9的等比中項x＝？;1-3/501a.png"
, "已知5 , y , 9成等比數列，求5與9的等比中項y＝？;1-3/502a.png"
, "已知－1 , z , －7成等比數列，求1與7的等比中項z＝？;1-3/503a.png"
, "已知－2 , p , －8成等比數列，求－2與－8的等比中項p＝？;±4"
, "已知2 , x , 14成等比數列，求2與14的等比中項x＝？。;1-3/505a.png"
, "已知5 , y , 12成等比數列，求5與12的等比中項y＝？;1-3/506a.png"
, "已知－4 , z ,－9成等比數列，求－4與－9的等比中項z＝？;±6"
, "已知－6 , p ,－12成等比數列，求－6與－12的等比中項p＝？;1-3/508a.png"

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
