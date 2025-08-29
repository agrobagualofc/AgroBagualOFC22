import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Landing() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleRegister = () => {
    // In a real app, this would create the account first, then redirect to login
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center p-6">
        {/* Logo and Title */}
        <div className="text-center mb-8" data-testid="header-section">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg" data-testid="logo-container">
            <Sprout className="w-12 h-12 text-green-600" data-testid="logo-icon" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2" data-testid="app-title">AgroBagual</h1>
          <p className="text-white text-lg font-medium" data-testid="app-slogan">O futuro do agro na palma da sua mão</p>
        </div>
        
        {/* Login/Register Form */}
        <Card className="w-full max-w-sm glass-effect border-0" data-testid="auth-form">
          <div className="p-6">
            {!showRegister ? (
              // Login Form
              <div className="space-y-4" data-testid="login-form">
                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    type="email" 
                    placeholder="E-mail" 
                    className="pl-10 bg-white bg-opacity-90 border-gray-300 premium-input"
                    data-testid="input-email"
                  />
                </div>
                
                {/* Password Input */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Senha" 
                    className="pl-10 pr-12 bg-white bg-opacity-90 border-gray-300 premium-input"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Forgot Password */}
                <div className="text-center">
                  <button 
                    className="text-white text-sm underline hover:text-yellow-300 transition-colors"
                    data-testid="button-forgot-password"
                  >
                    Esqueci a senha
                  </button>
                </div>
                
                {/* Login Button */}
                <Button 
                  onClick={handleLogin}
                  className="w-full premium-button text-white font-semibold py-6 rounded-lg"
                  data-testid="button-login"
                >
                  Vamos Lá
                </Button>
                
                {/* Create Account */}
                <div className="text-center">
                  <button 
                    onClick={() => setShowRegister(true)}
                    className="text-white text-sm hover:text-yellow-300 transition-colors"
                    data-testid="button-show-register"
                  >
                    Criar conta
                  </button>
                </div>
              </div>
            ) : (
              // Register Form
              <div className="space-y-4" data-testid="register-form">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-white mb-2" data-testid="register-title">Criar Conta</h2>
                  <p className="text-white opacity-75" data-testid="register-subtitle">Junte-se à revolução agrícola</p>
                </div>

                <Input 
                  type="text" 
                  placeholder="Nome completo" 
                  className="bg-white bg-opacity-90 border-gray-300 premium-input"
                  data-testid="input-full-name"
                />
                <Input 
                  type="email" 
                  placeholder="E-mail" 
                  className="bg-white bg-opacity-90 border-gray-300 premium-input"
                  data-testid="input-register-email"
                />
                <Input 
                  type="password" 
                  placeholder="Senha" 
                  className="bg-white bg-opacity-90 border-gray-300 premium-input"
                  data-testid="input-register-password"
                />
                <Input 
                  type="password" 
                  placeholder="Repetir senha" 
                  className="bg-white bg-opacity-90 border-gray-300 premium-input"
                  data-testid="input-confirm-password"
                />
                <Input 
                  type="date" 
                  className="bg-white bg-opacity-90 border-gray-300 premium-input"
                  data-testid="input-birth-date"
                />
                
                <Select>
                  <SelectTrigger className="bg-white bg-opacity-90 border-gray-300" data-testid="select-role">
                    <SelectValue placeholder="Função no agro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="produtor">Produtor Rural</SelectItem>
                    <SelectItem value="pecuarista">Pecuarista</SelectItem>
                    <SelectItem value="agricultor">Agricultor</SelectItem>
                    <SelectItem value="tecnico">Técnico Agrícola</SelectItem>
                    <SelectItem value="estudante">Estudante</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleRegister}
                  className="w-full premium-button text-white font-semibold py-6 rounded-lg"
                  data-testid="button-register"
                >
                  Criar Conta
                </Button>
                
                <button 
                  onClick={() => setShowRegister(false)}
                  className="w-full text-white text-sm hover:text-yellow-300 transition-colors"
                  data-testid="button-back-to-login"
                >
                  Já tenho conta
                </button>
              </div>
            )}
            
            {/* Security Message */}
            <p className="text-white text-xs text-center mt-4 opacity-75" data-testid="security-message">
              Seus dados estão seguros conosco
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
