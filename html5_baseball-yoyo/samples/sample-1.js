﻿//
//開始比賽前,說明對話框的說明文字
//
helpText = "請找出空格較合適的語詞。";

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
//
//  底下的範例
//		1.採用三欄式的題庫
//
question_lines = new Array(
//-------------------以下開始貼您的題庫--------------------------
  "他生病了，(　)沒有來上學。;所以;因為"
, "爸爸(　)回家，就看電視。;一下班;一上班,不去班"
, "弟弟一回家，(　)打開電視。;就;在,來"
, "下一(　)是什麼課?。;節;選,叫"
//-------------------題庫結束------------------------------------
);


//基本設定
optionsTotal = 9;		//共有幾個選項
optionWidth = 100;		//每個選項的寬度
optionHeight = 100;		//每個選項的高度
optionColTotal = 3;		//一列有幾個選項


/******************************************************************
 以下為程式碼, 不要更動
 ******************************************************************/
getOneQuestion = function(tools) {
	return tools.getOneQuestion(question_lines);
};

