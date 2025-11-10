
// Enviar mensaje al chatbot
export async function sendMessageToChatbot(userMessage) {
  try {
    const response = await fetch('http://0.0.0.0:5000/api/chatBot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id_session": "S-001",  // Debes mantener la misma sesión
        "user_id": "U-123",     // ID único del usuario
        "messages": [
          {"type": "user", "message": userMessage}
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

