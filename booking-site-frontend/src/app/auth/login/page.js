import LoginForm from '@/components/Auth/LoginForm';

export const metadata = {
    title: 'RentCar - Вхід в систему',
    description: 'Вхід в особистий кабінет',
}

export default function LoginPage() {
    return (
        <div className="py-10">
            <LoginForm />
        </div>
    );
}