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
  "2-2/23001.png;2-2/3001.png"
, "2-2/23002.png;4"
, "2-2/23003.png;2-2/3003.png"
, "2-2/23004.png;8"
, "2-2/23005.png;2-2/3005.png"
, "2-2/23006.png;2"
, "2-2/23007.png;2-2/3007.png"
, "2-2/23008.png;3"
, "2-2/23009.png;25"
, "2-2/23010.png;7"
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
