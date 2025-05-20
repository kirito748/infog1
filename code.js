"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("modern");

  const styles = {
    modern: "Современный минималистичный",
    corporate: "Корпоративный",
    creative: "Креативный",
    technical: "Технический",
    educational: "Образовательный",
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const fullPrompt = `Create an infographic with ${styles[style]} style that shows: ${prompt}. Make it clear, professional and visually appealing.`;
      const response = await fetch(
        `/integrations/dall-e-3/?prompt=${encodeURIComponent(fullPrompt)}`
      );
      if (!response.ok) {
        throw new Error(`Ошибка генерации: ${response.statusText}`);
      }
      const result = await response.json();
      setImage(result.data[0]);
    } catch (err) {
      console.error(err);
      setError("Не удалось создать инфографику. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-12 text-purple-300">
          Генератор Инфографики
        </h1>
        <div className="max-w-md mx-auto text-center space-y-6">
          <p className="text-xl">
            Пожалуйста, войдите или зарегистрируйтесь, чтобы использовать
            генератор
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/account/signin"
              className="py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-lg font-semibold"
            >
              Войти
            </a>
            <a
              href="/account/signup"
              className="py-2 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-lg font-semibold"
            >
              Регистрация
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-purple-300">
          Генератор Инфографики
        </h1>
        <a
          href="/account/logout"
          className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Выйти
        </a>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <label className="block mb-2 text-lg text-purple-300">
              Выберите стиль:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(styles).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setStyle(key)}
                  className={`p-2 rounded-lg transition-colors ${
                    style === key
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Опишите содержание инфографики..."
            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            rows={4}
          />

          <button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-lg font-semibold"
          >
            {loading ? "Создаём..." : "Создать Инфографику"}
          </button>
        </div>

        {error && (
          <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        {image && (
          <div className="flex flex-col items-center gap-4">
            <img
              src={image}
              alt="Сгенерированная инфографика"
              className="rounded-lg shadow-lg max-w-full"
            />
            <button
              onClick={() => window.open(image, "_blank")}
              className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Открыть в полном размере
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;
