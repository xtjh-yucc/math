title = '形近字';
question_lines = new Array(
  '總 聰,ㄗㄨㄥˇ總 ㄕˋ是,ㄗㄨㄥˇ總 ㄍㄨㄥˋ共,ㄘㄨㄥ聰 ㄇㄧㄥˊ明,ㄘㄨㄥ聰 ㄏㄨㄟˋ慧'
, '藹 靄,ㄏㄜˊ和 ㄞˇ藹,ㄘˊ慈 ㄞˇ藹,ㄩㄣˊ雲 ㄞˇ靄,ㄇㄨˋ暮 ㄞˇ靄'
, '肌 飢,ㄐㄧ肌 ㄖㄡˋ肉,ㄇㄧㄢˋ面 ㄏㄨㄤˊ黃 ㄐㄧ肌 ㄕㄡˋ瘦,ㄐㄧ飢 ㄜˋ餓,ㄐㄧ飢 ㄏㄢˊ寒 ㄐㄧㄠ交 ㄆㄛˋ迫'
, '陵 稜,ㄑㄧㄡ丘 ㄌㄧㄥˊ陵,ㄕㄢ山 ㄌㄧㄥˊ陵,ㄌㄥˊ稜 ㄒㄧㄢˋ線,ㄙㄢ三 ㄌㄥˊ稜 ㄐㄧㄥˋ鏡'
, '絨 戎,ㄖㄨㄥˊ絨 ㄅㄨˋ布,ㄖㄨㄥˊ絨 ㄇㄠˊ毛,ㄖㄨㄥˊ戎 ㄓㄨㄤ裝,ㄊㄡˊ投 ㄅㄧˇ筆 ㄘㄨㄥˊ從 ㄖㄨㄥˊ戎'
, '摘 滴,ㄓㄞ摘 ㄏㄨㄚ花,ㄓㄞ摘 ㄧㄠˋ要,ㄩˇ雨 ㄉㄧ滴,ㄉㄧ滴 ㄕㄨㄟˇ水 ㄔㄨㄢ穿 ㄕˊ石'
, '緩 援 暖,ㄏㄨㄢˇ緩 ㄇㄢˋ慢,ㄏㄨㄢˇ緩 ㄏㄜˊ和,ㄩㄢˊ援 ㄓㄨˋ助,ㄩㄢˊ援 ㄕㄡˇ手,ㄨㄣ溫 ㄋㄨㄢˇ暖,ㄋㄨㄢˇ暖 ˙ㄏㄨㄛ和'
, '沉 沈,ㄒㄧㄚˋ下 ㄔㄣˊ沉,ㄔㄣˊ沉 ㄇㄛˋ沒,ㄕㄣˇ沈 ㄒㄧㄢ先 ˙ㄕㄥ生'
, '躍 耀,ㄊㄧㄠˋ跳 ㄩㄝˋ躍,ㄏㄨㄛˊ活 ㄩㄝˋ躍,ㄕㄢˇ閃 ㄧㄠˋ耀,ㄧㄠˋ耀 ㄧㄢˇ眼'
);

/******************************************************************
 以下為程式碼, 不要更動
 ******************************************************************/
getOneQuestion = function(tools) {
	return tools.getOneQuestion(question_lines,'語文高手');
};