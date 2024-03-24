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
"3-1/35001.png;3-1/5001.png"
, "3-1/35002.png;3-1/5002.png"
, "3-1/35003.png;3-1/5003.png"
, "3-1/35004.png;3-1/5004.png"
, "3-1/35005.png;3-1/5005.png"
, "3-1/35006.png;3-1/5006.png"
, "3-1/35007.png;3-1/5007.png"
, "3-1/35008.png;2/5"
, "3-1/35009.png;3-1/5009.png"
, "3-1/35010.png;3-1/5010.png"
, "3-1/35011.png;3-1/5011.png"
, "3-1/35012.png;3-1/5012.png"
, "3-1/35013.png;3-1/5013.png"

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
