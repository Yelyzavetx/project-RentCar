import RegisterForm from '@/components/Auth/RegisterForm';

export const metadata = {
    title: 'RentCar - Реєстрація',
    description: 'Створення нового облікового запису',
}

export default function RegisterPage() {
    return (
        <div className="py-10">
            <RegisterForm />
        </div>
    );
}