import {
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
} from '@heroicons/react/24/outline';
import { PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid';
import type { ComponentType, SVGProps } from 'react';

export type MenuItem = {
  name: string;
  path?: string;
  basePath?: string;
  inactive?: boolean;
  subCategories?: SubCategory[];
  callsToAction?: CallToAction[];
};

export type SubCategory = {
  name: string;
  description: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  inactive?: boolean;
};

export type CallToAction = {
  name: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  inactive?: boolean;
};

export const menus: MenuItem[] = [
  {
    name: '재무',
    basePath: '/finance',
    subCategories: [
      { name: '재무 데이터 입력', description: '계좌별 수입/지출 데이터 입력', path: '/insert', icon: CursorArrowRaysIcon },
      { name: '재무 상태', description: '재무 상태 파악', path: '/status', icon: CursorArrowRaysIcon, inactive: true },
    ],
    callsToAction: [
      { name: '자동화', path: '/automation', icon: PlayCircleIcon, inactive: true },
      { name: '사용 가이드', path: '/guide', icon: PhoneIcon, inactive: true },
    ],
  },
  {
    name: '관리',
    basePath: '/management',
    subCategories: [
      { name: '계좌 관리', description: '계좌 등록, 수정 및 삭제', path: '/account', icon: ChartPieIcon },
      { name: '은행 관리', description: '은행 정보 관리', path: '/bank', icon: ChartPieIcon },
      { name: '코드 관리', description: '코드 등록, 수정 및 삭제', path: '/code', icon: ChartPieIcon },
      { name: '부처 관리', description: '부처 정보 관리', path: '/ministry', icon: ChartPieIcon },
    ],
  },
  {
    name: '리포트',
    basePath: '/report',
    subCategories: [
      { name: '지출 상세 리포트', description: '지출 세부 분석', path: '/expense', icon: FingerPrintIcon, inactive: true },
    ],
  },
  {
    name: '소개',
    path: '/about',
    inactive: true,
  },
];
