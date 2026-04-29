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
    lastLoginAt: Date;
}