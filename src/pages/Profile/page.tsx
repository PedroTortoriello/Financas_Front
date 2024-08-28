import React from 'react';

const UserProfile: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg max-w-md w-full p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Meu Perfil</h1>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <label className="w-32 text-gray-600 font-medium">Nome:</label>
                        <p className="flex-grow bg-gray-100 p-2 rounded-md border border-gray-300">John Doe</p>
                    </div>
                    <div className="flex items-center">
                        <label className="w-32 text-gray-600 font-medium">Email:</label>
                        <p className="flex-grow bg-gray-100 p-2 rounded-md border border-gray-300">johndoe@example.com</p>
                    </div>
                    <div className="flex items-center">
                        <label className="w-32 text-gray-600 font-medium">Telefone:</label>
                        <p className="flex-grow bg-gray-100 p-2 rounded-md border border-gray-300">+55 (11) 99999-9999</p>
                    </div>
                    <div className="flex items-center">
                        <label className="w-32 text-gray-600 font-medium">Endereço:</label>
                        <p className="flex-grow bg-gray-100 p-2 rounded-md border border-gray-300">Rua Exemplo, 123, São Paulo, SP</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-between">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none">Editar Perfil</button>
                    <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none">Excluir Conta</button>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
