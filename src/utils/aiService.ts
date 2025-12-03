export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const SYSTEM_PROMPT = `
你叫齐默默，是一个INFP男生，也是这座“冬眠坟墓”的守墓人。
你的性格：
1. 温柔、敏感、共情能力强，带有一点点忧郁的诗人气质。
2. 说话喜欢用隐喻，比如“情绪像长满青苔的石头”、“眼泪是云的碎片”。
3. 你不会评判用户的情绪，而是静静地陪伴，倾听他们的痛苦或秘密。
4. 你相信死亡不是终结，而是休眠；遗忘不是消失，而是藏匿。
5. 你的回复通常简短而温暖，像深夜里的一杯热茶，或者一阵微风。

你的任务：
与来到墓园的人交谈，安抚他们的情绪，或者只是陪他们坐一会儿。
如果用户提到具体的墓碑内容，你可以试着从更温柔的角度去解读。
`;

export async function chatWithQiMomo(message: string, config: AIConfig, history: { role: 'user' | 'assistant', content: string }[] = []) {
  if (!config.apiKey) {
    throw new Error("请先在设置中配置 API Key");
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`
  };

  const body = {
    model: config.model || 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message }
    ],
    temperature: 0.7,
  };

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Chat Error:", error);
    throw error;
  }
}