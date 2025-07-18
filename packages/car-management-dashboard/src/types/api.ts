// 基于 OpenAPI 规范的类型定义

export interface LoginInput {
  username: string;
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: "super_admin" | "admin" | "tenant_viewer";
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface Tenant {
  id: string;
  name: string;
  appId: string;
  appSecret: string;
  status: "active" | "inactive";
  config?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantInput {
  name: string;
  appId: string;
  appSecret: string;
  status?: "active" | "inactive";
  config?: Record<string, any>;
}

export interface UpdateTenantInput {
  name?: string;
  appId?: string;
  appSecret?: string;
  status?: "active" | "inactive";
  config?: Record<string, any>;
}

export interface VehicleScenario {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleScenarioInput {
  name: string;
  description: string;
  image: string;
}

export interface UpdateVehicleScenarioInput {
  name?: string;
  description?: string;
  image?: string;
}

export interface Highlight {
  title: string;
  icon: string;
}

export interface CarCategory {
  id: string;
  tenantId: string;
  name: string;
  image: string;
  badge?: string;
  tags?: string[];
  highlights?: Highlight[];
  interiorImages?: string[];
  exteriorImages?: string[];
  offerPictures?: string[];
  createdAt: string;
  updatedAt: string;
  vehicleScenario?: VehicleScenario;
  isArchived: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateCarCategoryInput {
  name: string;
  image: string;
  badge?: string;
  tags?: string[];
  highlights?: Highlight[];
  interiorImages?: string[];
  exteriorImages?: string[];
  offerPictures?: string[];
  vehicleScenarioId: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface UpdateCarCategoryInput {
  name?: string;
  image?: string;
  badge?: string;
  tags?: string[];
  highlights?: Highlight[];
  interiorImages?: string[];
  exteriorImages?: string[];
  offerPictures?: string[];
  vehicleScenarioId?: string;
  isArchived?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface Image {
  id: string;
  url: string;
}

export interface Feature {
  title: string;
  icon: string;
}

export interface CarTrim {
  id: string;
  tenantId: string;
  name: string;
  subtitle: string;
  configImageUrl?: string;
  originalPrice: string;
  currentPrice: string;
  priceOverrideText?: string;
  badge?: string;
  features?: Feature[];
  categoryId: string;
  category?: CarCategory;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  images?: Image[];
}

export interface CreateCarTrimInput {
  name: string;
  subtitle: string;
  configImageUrl?: string;
  originalPrice: string;
  currentPrice: string;
  priceOverrideText?: string;
  badge?: string;
  features?: Feature[];
  categoryId: string;
  isArchived?: boolean;
}

export interface UpdateCarTrimInput {
  name?: string;
  subtitle?: string;
  configImageUrl?: string;
  originalPrice?: string;
  currentPrice?: string;
  priceOverrideText?: string;
  badge?: string;
  features?: Feature[];
  categoryId?: string;
  isArchived?: boolean;
}

export interface UserInFavorite {
  id: string;
  nickname: string;
  avatarUrl: string;
  openId: string;
}

export interface CarTrimWithFavorites extends CarTrim {
  favoritedBy: {
    user: UserInFavorite;
    createdAt: string;
  }[];
}

export interface User {
  id: string;
  tenantId: string;
  nickname: string;
  avatarUrl: string;
  phoneNumber: string;
  openId: string;
  unionId: string | null;
  createdAt: string;
  updatedAt: string;
  favoritesCount?: number;
}

export interface UserFavoriteCarTrim {
  userId: string;
  carTrimId: string;
  createdAt: string;
  carTrim: CarTrim;
}

export interface UserWithFavorites extends User {
  favoriteCarTrims: UserFavoriteCarTrim[];
}

export interface CreateAdminUserInput {
  username: string;
  password: string;
  role: "super_admin" | "admin" | "tenant_viewer";
  tenantId?: string;
}

export interface UpdateAdminUserInput {
  username?: string;
  password?: string;
  role?: "super_admin" | "admin" | "tenant_viewer";
  tenantId?: string;
}

export interface UploadToken {
  secretId: string;
  secretKey: string;
  sessionToken: string;
  region: string;
  bucket: string;
  expiredTime: number;
  startTime: number;
}

export interface DashboardStats {
  usersCount: number;
  carCategoriesCount: number;
  carTrimsCount: number;
  vehicleScenariosCount: number;
  pendingUserMessagesCount: number;
  processedUserMessagesCount: number;
  favoritesCount: number;
}

export interface HomepageConfig {
  id: string;
  tenantId: string;
  firstTitle: string;
  firstTitleIcon: string;
  secondTitle: string;
  secondTitleIcon: string;
  bannerImage?: string | null;
  bannerVideo?: string | null;
  bannerTitle?: string | null;
  bannerDescription?: string | null;
  benefitsImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateHomepageConfigInput {
  firstTitle: string;
  firstTitleIcon: string;
  secondTitle: string;
  secondTitleIcon: string;
  bannerImage?: string | null;
  bannerVideo?: string | null;
  bannerTitle?: string | null;
  bannerDescription?: string | null;
  benefitsImage: string;
}

export interface ContactUsConfig {
  id: string;
  tenantId: string;
  contactPhoneDescription?: string;
  contactPhoneNumber?: string;
  contactEmailDescription?: string;
  contactEmail?: string;
  workdays?: number[];
  workStartTime?: number | null;
  workEndTime?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateContactUsConfigInput {
  contactPhoneDescription?: string;
  contactPhoneNumber?: string;
  contactEmailDescription?: string;
  contactEmail?: string;
  workdays?: number[];
  workStartTime?: number | null;
  workEndTime?: number | null;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqInput {
  question: string;
  answer: string;
  icon: string;
}

export interface UpdateFaqInput {
  question?: string;
  answer?: string;
  icon?: string;
}

export interface UserMessage {
  id: string;
  name: string;
  contact: string;
  content: string;
  createdAt: string;
  status: "PENDING" | "PROCESSED";
  processedAt: string | null;
  processedBy: {
    username: string;
  } | null;
  user: {
    nickname: string;
    avatarUrl: string;
    phoneNumber: string;
    createdAt: string;
  };
}
