import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Planiprof" width={384} height={384} className="h-96 w-96 rounded-full object-cover" />
        </div>

        <p className="text-xl text-gray-600 mb-2">
          L'outil de planification pour les enseignants du Québec.
        </p>
        <p className="text-lg text-gray-500 mb-10">
          The planning tool for Quebec teachers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
          >
            Créer un compte / Sign up
          </Link>
          <Link
            href="/login"
            className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition"
          >
            Se connecter / Log in
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-800 mb-1">Planification globale</h3>
            <p className="text-gray-500 text-sm">Planifiez tous vos contenus pour l'année scolaire.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-2">🗓️</div>
            <h3 className="font-semibold text-gray-800 mb-1">Planification mensuelle & hebdomadaire</h3>
            <p className="text-gray-500 text-sm">Organisez vos semaines avec précision.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-semibold text-gray-800 mb-1">Communauté</h3>
            <p className="text-gray-500 text-sm">Partagez et découvrez des activités avec d'autres enseignants.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
