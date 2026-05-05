// types/index.ts


export interface AuthResponse {
    success: boolean;
    error?: string;
    user?: User;
    verificationId?: string;
}

export interface CustomInputProps {
    label?: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    error?: string | null;
    editable?: boolean;
    maxLength?: number;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
    onSubmitEditing?: () => void;
}

export interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    loading?: boolean;
    style?: object;
}

export interface SocialButtonProps {
    title: string;
    onPress: () => void;
    icon: string;
}

export interface PhoneLoginScreenProps {
    navigation: any;
}

export interface VerifyOTPScreenProps {
    route: {
        params: {
            phoneNumber: string;
            verificationId: string;
        };
    };
    navigation: any;
}

export interface HomeScreenProps {
    navigation: any;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
}

export interface CreateUser {
    phone_number: string;
    email: string;
    first_name: string;
    last_name: string;
    designation: string;
    location: string;
    avatar: string;
    about: string;

}

export interface User {
    uid: string;
    phone_number: string;
    email: string;
    first_name: string;
    last_name: string;
    designation: string;
    location: string;
    createdAt?: Date;
    avatar: string;
    about: string;
    connectionReqStatus?: "pending" | "rejected" | "accepted" | "requested" | null;
    interest?: string[];
}

export interface UserInterest {
    id: string;
    name: string;
    icon?: string;
    selected: boolean;
}

export interface Connection extends User {
    requestId: string;
}


export type Tab = "received" | "sent";


export interface Message {
    id: string;
    text: string;
    sentBy: User & { uid: string };
    createdAt: Date | null;
    isRead: boolean;
}

export interface Chat {
    chatId: string;
    otherUser: User & { uid: string };
    lastMessage: string | null;
    lastMessageSenderId: string | null;
    lastMessageTime: Date | null;
    unreadCount: number;
}