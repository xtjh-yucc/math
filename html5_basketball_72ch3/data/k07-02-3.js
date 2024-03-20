title = '多音字';
question_lines = new Array(
  'ㄇㄞˋ ㄇㄛˋ,ㄕㄢ山 ㄇㄞˋ脈,ㄧㄝˋ葉 ㄇㄞˋ脈,ㄏㄢˊ含 ㄑㄧㄥˊ情 ㄇㄛˋ脈 ㄇㄛˋ脈'
, 'ㄗㄨㄥ ㄗㄨㄥˋ,ㄗㄨㄥ縱 ㄏㄥˊ橫 ㄐㄧㄠ交 ㄘㄨㄛˋ錯,ㄗㄨㄥ縱 ㄉㄨㄟˋ隊,ㄗㄨㄥˋ縱 ㄏㄨˇ虎 ㄍㄨㄟ歸 ㄕㄢ山,ㄩˋ欲 ㄑㄧㄣˊ擒 ㄍㄨˋ故 ㄗㄨㄥˋ縱,ㄗㄨㄥˋ縱 ㄏㄨㄛˇ火,ㄗㄨㄥˋ縱 ㄕˇ使'
, 'ㄑㄧㄝ ㄑㄧㄝˋ,ㄑㄧㄝ切 ㄉㄨㄢˋ斷,ㄑㄧㄝˋ切 ㄘㄞˋ菜,ㄊㄧㄝ貼 ㄑㄧㄝˋ切,ㄐㄧˊ急 ㄑㄧㄝˋ切,ㄑㄧㄝˋ切 ㄐㄧˋ記'
, 'ㄆㄧㄠˋ ㄆㄧㄠ ㄆㄧㄠˇ,ㄆㄧㄠˋ漂 ㄌㄧㄤˋ亮,ㄆㄧㄠ漂 ㄈㄨˊ浮,ㄆㄧㄠ漂 ㄌㄧㄡˊ流,ㄆㄧㄠˇ漂 ㄅㄞˊ白,ㄆㄧㄠˇ漂 ㄖㄢˇ染'
, 'ㄑㄩ ㄑㄩˇ,ㄑㄩ曲 ㄒㄧㄢˋ線,ㄨㄢ彎 ㄑㄩ曲,ㄑㄩ曲 ㄒㄧ膝,ㄍㄜ歌 ㄑㄩˇ曲,ㄍㄠ高 ㄍㄜ歌 ㄧ一 ㄑㄩˇ曲'
);

/******************************************************************
 以下為程式碼, 不要更動
 ******************************************************************/
getOneQuestion = function(tools) {
	return tools.getOneQuestion(question_lines,'語文高手');
};