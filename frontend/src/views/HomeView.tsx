import { useMemo, useState } from 'react';

import { useAuthStore } from '../hooks/authentication/authStore';
import { UserSchema } from '../services/schemas/userSchema';

export function HomeView() {
  const userName = useAuthStore((state) => state.userName);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const [loginInput, setLoginInput] = useState('');

  const [idInput, setIdInput] = useState('1');
  const [nameInput, setNameInput] = useState('홍길동');
  const [emailInput, setEmailInput] = useState('hong@example.com');

  const [zodResult, setZodResult] = useState('아직 검사 안 함');

  const authSnapshot = useMemo(
    () => ({
      userName,
      isLoggedIn,
    }),
    [userName, isLoggedIn]
  );

  const handleLogin = () => {
    const trimmedName = loginInput.trim();
    if (!trimmedName) return;

    login(trimmedName);
    setLoginInput('');
  };

  const handleZodTest = () => {
    const inputData = {
      id: Number(idInput),
      name: nameInput,
      email: emailInput,
    };

    const result = UserSchema.safeParse(inputData);

    if (result.success) {
      setZodResult(
        JSON.stringify(
          {
            success: true,
            data: result.data,
          },
          null,
          2
        )
      );
      return;
    }

    setZodResult(
      JSON.stringify(
        {
          success: false,
          errors: result.error.flatten(),
        },
        null,
        2
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-10">

      {/* Zustand 테스트 */}
      <section className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold">Zustand 테스트</h1>

        <p className="text-gray-600">
          현재 상태 :
          <span className="ml-2 font-semibold">
            {isLoggedIn ? `${userName} 님 로그인 상태` : '비로그인 상태'}
          </span>
        </p>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            placeholder="사용자 이름 입력"
            className="border rounded-lg px-3 py-2 w-56 focus:outline-none focus:ring focus:ring-blue-200"
          />

          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            로그인
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            로그아웃
          </button>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Zustand Store 상태</h2>

          <pre className="bg-gray-100 border rounded-lg p-4 text-sm overflow-auto">
            {JSON.stringify(authSnapshot, null, 2)}
          </pre>
        </div>
      </section>


      {/* Zod 테스트 */}
      <section className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-2xl font-bold">Zod 테스트</h2>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">ID</label>
            <input
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">이름</label>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">이메일</label>
            <input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 border rounded-lg p-3">
          <p className="font-semibold mb-1">검증 기준</p>
          <ul className="list-disc list-inside space-y-1">
            <li>id : number</li>
            <li>name : 최소 2자 이상 문자열</li>
            <li>email : 이메일 형식</li>
          </ul>
        </div>

        <button
          onClick={handleZodTest}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Zod 검사 실행
        </button>

        <div>
          <h3 className="font-semibold mb-2">검사 결과</h3>

          <pre className="bg-gray-100 border rounded-lg p-4 text-sm overflow-auto">
            {zodResult}
          </pre>
        </div>
      </section>

    </div>
  );
}