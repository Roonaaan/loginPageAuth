import Swal from "sweetalert2";

const OAuthButtons = () => {
  const handleOAuth = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  const handleGoTyme = () => {
    Swal.fire({
      title: "GoTyme Bank 🏦",
      html: `
        <p>Redirecting to GoTyme Bank secure login...</p>
        <br/>
        <p style="font-size: 2rem">🤡</p>
        <p style="color: #94a3b8; font-size: 0.85rem">Nah bro this isn't real 😂</p>
      `,
      icon: "info",
      confirmButtonText: "Lol okay 😂",
      confirmButtonColor: "#3b82f6",
      background: "#1e293b",
      color: "#ffffff",
    });
  };

  return (
    <div>
      <button className="oauth-btn google" onClick={() => handleOAuth("google")}>
        <img src="https://www.svgrepo.com/show/452216/google.svg" alt="Google" />
        Continue with Google
      </button>

      <button className="oauth-btn github" onClick={() => handleOAuth("github")}>
        <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" />
        Continue with GitHub
      </button>

      <button className="oauth-btn gotyme" onClick={handleGoTyme}>
        <img src="https://cdn.brandfetch.io/idnIc2_J5Q/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1668014126564" alt="GitHub" />
        Continue with GoTyme Bank
      </button>
    </div>
  );
};

export default OAuthButtons;