import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { AlertCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4  ">
      <Card className="text-center max-w-md p-10 bg-white/20 backdrop-blur-md shadow-xl rounded-3xl">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-20 h-20 text-red-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 text-white">404</h1>
        <p className="text-lg text-white/80 mb-6">
          Oops! que falta de sorte em,kkkk.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-blue-500 to-light text-white px-6 py-3 hover:scale-105 transition-transform duration-300">
            Voltar para Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};