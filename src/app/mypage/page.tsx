'use client';
import Header from "@/components/Header";
import MyPage from "@/components/Layouts/MyPage";

export default function MyPageWrapper() {
  return (
    <>
      <Header showTopPage />
      <MyPage />
    </>
  );
}
