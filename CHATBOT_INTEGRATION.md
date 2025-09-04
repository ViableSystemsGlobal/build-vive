# 🚀 Floating Chatbot Integration Guide

## Overview
The ACE Construction website now includes a comprehensive floating chatbot system that provides immediate assistance to users, especially after quote submissions. The chatbot can handle emergency situations, provide general construction advice, and escalate urgent cases to human support.

## ✨ Features

### 🎯 Core Functionality
- **Floating Chat Button**: Always accessible bottom-right corner button
- **Auto-Open After Quote**: Automatically opens when users submit quote forms
- **Emergency Detection**: Identifies and responds to urgent situations
- **Smart Escalation**: Offers to call users for immediate assistance
- **Admin Configuration**: Fully customizable responses via admin panel

### 🚨 Emergency Response
- **Plumbing Leaks**: Water shutoff procedures, safety steps
- **Electrical Issues**: Power safety, evacuation guidance
- **Structural Damage**: Safety protocols, documentation
- **Gas Leaks**: Evacuation procedures, emergency contacts

### 💡 General Advice
- **Renovation Planning**: Budget tips, permit information
- **Maintenance**: Regular inspection schedules, best practices
- **Permits**: Legal requirements, processing times
- **Budget Planning**: Cost considerations, contingency planning
- **Timeline**: Project duration estimates, factors affecting schedules

## 🏗️ Technical Architecture

### Frontend Components
```
website/app/components/
├── FloatingChat.tsx          # Main chatbot component
├── QuoteProvider.tsx         # Context for quote state
└── QuoteModal.tsx            # Quote form with chatbot trigger
```

### Backend API Endpoints
```
website/app/api/
├── chat/route.ts             # Chat message processing
└── escalate/route.ts         # Emergency escalation handling
```

### Integration Points
- **Layout**: Chatbot added to root layout for site-wide access
- **Quote Flow**: Auto-triggers after successful quote submission
- **Admin Panel**: Chatbot settings in homepage editor

## 🔧 Installation & Setup

### 1. Components Already Added
✅ FloatingChat component created
✅ Chat API endpoint implemented
✅ Escalation API endpoint created
✅ Admin panel integration added
✅ Quote flow integration completed

### 2. Current Status
- **Chatbot**: Fully functional with rule-based responses
- **Emergency Detection**: Working for common construction issues
- **Admin Settings**: Available for customizing responses
- **Quote Integration**: Auto-opens after quote submission

### 3. Next Steps (Future Implementation)
- [ ] SMS integration (Twilio/Africa's Talking)
- [ ] VAPI call triggering
- [ ] Advanced AI responses
- [ ] Chat history persistence
- [ ] User authentication for chat

## 🎮 Usage Examples

### Emergency Scenarios
```
User: "I have a water leak in my basement"
Bot: 🚨 EMERGENCY: Plumbing leak detected!
     1. Shut off your main water valve immediately
     2. Close all nearby taps and drains
     3. Place buckets under active leaks
     4. Turn off electrical appliances in affected areas
     Would you like us to call you right now for immediate assistance?

User: "Yes, call me now"
Bot: We're calling you now! Please keep your phone nearby.
```

### General Advice
```
User: "How do I plan a kitchen renovation?"
Bot: 🏠 Renovation Planning Tips:
     1. Set a realistic budget (add 20% buffer)
     2. Research local permits and regulations
     3. Plan for temporary living arrangements if needed
     4. Choose materials that match your climate
     5. Consider energy efficiency upgrades
```

## ⚙️ Admin Configuration

### Accessing Chatbot Settings
1. Go to `/admin/homepage`
2. Click on "Chatbot Settings" tab
3. Customize responses for:
   - Greeting messages
   - Emergency responses
   - General advice
   - Escalation messages
   - Emergency phone numbers

### Customizable Fields
- **chatbotGreeting**: Message shown after quote submission
- **plumbingLeakResponse**: Emergency response for water issues
- **electricalIssueResponse**: Emergency response for electrical problems
- **renovationPlanningResponse**: Advice for renovation planning
- **maintenanceTipsResponse**: Regular maintenance guidance
- **escalationMessage**: Confirmation when escalation is triggered
- **emergencyPhone**: Direct contact number for emergencies

## 🔌 API Endpoints

### POST /api/chat
Processes user messages and returns bot responses.

**Request:**
```json
{
  "message": "I have a plumbing leak"
}
```

**Response:**
```json
{
  "response": "🚨 EMERGENCY: Plumbing leak detected!\n1. Shut off your main water valve immediately...",
  "escalate": true
}
```

### POST /api/escalate
Handles emergency escalation requests.

**Request:**
```json
{
  "reason": "Chatbot escalation",
  "userMessage": "I have a plumbing leak",
  "userPhone": "+1234567890",
  "userName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Escalation processed successfully. Team will contact you shortly.",
  "escalationId": "ESC_1234567890_abc123def"
}
```

## 🎨 Customization

### Styling
The chatbot uses Tailwind CSS classes and can be customized by modifying:
- Colors: Update `bg-primary` classes
- Sizing: Modify `w-96 h-[500px]` dimensions
- Positioning: Adjust `bottom-6 right-6` coordinates

### Response Logic
Modify the rule-based system in `/api/chat/route.ts`:
- Add new emergency keywords
- Expand general advice categories
- Customize escalation triggers

### Admin Interface
Add new configuration fields in the admin panel:
1. Update `HomepageData` type
2. Add form fields in admin component
3. Update API response handling

## 🚀 Future Enhancements

### Phase 2: Advanced Features
- **AI Integration**: Connect to OpenAI or similar for dynamic responses
- **Chat History**: Persist conversations in database
- **User Profiles**: Track user preferences and history
- **Multi-language**: Support for Spanish and other languages
- **File Uploads**: Allow users to share photos of issues

### Phase 3: Enterprise Features
- **Team Assignment**: Route chats to appropriate specialists
- **Analytics Dashboard**: Track chat metrics and user satisfaction
- **Integration APIs**: Connect with CRM and project management systems
- **Mobile App**: Native mobile chatbot experience

## 🐛 Troubleshooting

### Common Issues
1. **Chat not opening after quote**: Check browser console for errors
2. **Responses not loading**: Verify `/api/chat` endpoint is accessible
3. **Admin settings not saving**: Check `/api/admin/homepage` endpoint
4. **Styling issues**: Verify Tailwind CSS is properly loaded

### Debug Mode
Enable console logging by checking browser developer tools:
- Network tab: Monitor API calls
- Console tab: View error messages
- Elements tab: Inspect chatbot DOM structure

## 📞 Support

For technical support or feature requests:
- Check the admin panel for configuration issues
- Review browser console for error messages
- Verify API endpoints are responding correctly
- Test with different user scenarios

---

**Built with ❤️ for ACE Construction**
*Providing immediate assistance when it matters most*
