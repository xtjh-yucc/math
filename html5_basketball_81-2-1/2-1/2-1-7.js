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
   "1-3/701.png;2"
, "1-3/702.png;1"
, "1-3/703.png;3"
, "1-3/704.png;－7x＋2"
, "1-3/705.png;2x－1"
, "1-3/706.png;－16x＋52"
, "1-3/707.png;2x＋4"
, "1-3/708.png;8x＋7"
, "1-3/709.png;－6x－13"
, "1-3/710.png;－9x＋1"
, "1-3/711.png;15x＋2"


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
