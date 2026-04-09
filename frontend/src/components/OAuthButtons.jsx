const OAuthButtons = () => {
  const handleOAuth = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div>
      <button className="oauth-btn google" onClick={() => handleOAuth("google")}>
        <img src="https://www.svgrepo.com/show/452216/google.svg" alt="Google" />
        Continue with Google
      </button>

      <button className="oauth-btn microsoft" onClick={() => handleOAuth("microsoft")}>
        <img src="https://www.svgrepo.com/show/448239/microsoft.svg" alt="Microsoft" />
        Continue with Microsoft
      </button>

      <button className="oauth-btn facebook" onClick={() => handleOAuth("facebook")}>
        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" />
        Continue with Facebook
      </button>
    </div>
  );
};

export default OAuthButtons;