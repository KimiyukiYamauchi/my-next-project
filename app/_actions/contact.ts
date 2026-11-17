"use server";

import { supabase } from "@/app/_libs/supabase";

function validateEmail(email: string) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// 各項目の最大文字数（大量データの送り付けを防ぐ）
const MAX_LENGTH = {
  lastname: 50,
  firstname: 50,
  company: 100,
  email: 254,
  message: 2000,
} as const;

// 文字列以外（ファイル等）が送られてきた場合は空文字として扱う
function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function createContactData(
  _prevState: unknown,
  formData: FormData,
) {
  // formのname属性ごとにformData.get()で値を取り出すことができる
  const rawFormData = {
    lastname: getString(formData, "lastname"),
    firstname: getString(formData, "firstname"),
    company: getString(formData, "company"),
    email: getString(formData, "email"),
    message: getString(formData, "message"),
  };

  // ハニーポット: 人には見えない項目に値が入っていればボットとみなし、保存せずに成功を返す
  if (getString(formData, "website")) {
    return { status: "success", message: "OK" };
  }

  for (const key of Object.keys(MAX_LENGTH) as (keyof typeof MAX_LENGTH)[]) {
    if (rawFormData[key].length > MAX_LENGTH[key]) {
      return {
        status: "error",
        values: rawFormData,
        message: `入力が長すぎます（${MAX_LENGTH[key]}文字以内で入力してください）`,
      };
    }
  }

  // エラー時は values に入力値を入れて返し、フォームに入力内容を戻す
  if (!rawFormData.lastname) {
    return {
      status: "error",
      values: rawFormData,
      message: "姓を入力してください",
    };
  }
  if (!rawFormData.firstname) {
    return {
      status: "error",
      values: rawFormData,
      message: "名を入力してください",
    };
  }
  if (!rawFormData.company) {
    return {
      status: "error",
      values: rawFormData,
      message: "会社名を入力してください",
    };
  }
  if (!rawFormData.email) {
    return {
      status: "error",
      values: rawFormData,
      message: "メールアドレスを入力してください",
    };
  }
  if (!validateEmail(rawFormData.email)) {
    return {
      status: "error",
      values: rawFormData,
      message: "メールアドレスの形式が誤っています",
    };
  }
  if (!rawFormData.message) {
    return {
      status: "error",
      values: rawFormData,
      message: "メッセージを入力してください",
    };
  }

  // contacts テーブルに 1 行追加する
  const { error } = await supabase.from("contacts").insert(rawFormData);

  if (error) {
    console.log(error);
    return {
      status: "error",
      values: rawFormData,
      message: "お問い合わせに失敗しました",
    };
  }

  return { status: "success", message: "OK" };
}
