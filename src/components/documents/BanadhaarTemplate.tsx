import React from 'react';

export function BanadhaarTemplate({ banana, document }: { banana: any, document: any }) {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
      
      {/* FRONT OF CARD */}
      <div style={{ width: '600px', height: '380px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden', position: 'relative', border: '1px solid #ccc' }}>
         {/* Card Header */}
         <div style={{ backgroundColor: 'var(--gov-blue)', color: '#fff', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '50%', padding: '4px', display: 'flex' }}>
              <div style={{ width: '32px', height: '32px', border: '1px solid var(--muted-gold)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem' }}>🍌</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>NATIONAL BANANA REGISTRY</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-gold)' }}>BANANA IDENTITY CARD</div>
            </div>
         </div>

         <div style={{ padding: '24px', display: 'flex', gap: '24px' }}>
            {/* Photo Area */}
            <div style={{ width: '120px', height: '160px', border: '2px solid var(--gov-blue)', padding: '4px' }}>
               {banana.photo ? (
                 <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               ) : (
                 <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: '#999', fontSize: '0.8rem' }}>NO PHOTO</div>
               )}
            </div>

            {/* Details */}
            <div style={{ flex: 1 }}>
               <div style={{ marginBottom: '12px' }}>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Official Name</div>
                 <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>{banana.officialName}</div>
               </div>
               
               <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
                 <div>
                   <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Estimated Birth</div>
                   <div style={{ fontWeight: 'bold' }}>{banana.estimatedBirthDate ? new Date(banana.estimatedBirthDate).toLocaleDateString() : 'NOT AVAILABLE'}</div>
                 </div>
                 <div>
                   <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Origin</div>
                   <div style={{ fontWeight: 'bold' }}>{banana.origin || 'UNKNOWN'}</div>
                 </div>
               </div>

               <div style={{ marginBottom: '12px' }}>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Estimated Variety</div>
                 <div style={{ fontWeight: 'bold' }}>{banana.estimatedVariety || 'PENDING'}</div>
               </div>

               <div style={{ marginTop: '24px', textAlign: 'center' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--gov-blue)', letterSpacing: '4px' }}>
                   {banana.registrationNumber}
                 </div>
               </div>
            </div>
         </div>
         
         <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '8px', backgroundColor: 'var(--muted-gold)' }}></div>
      </div>

      {/* BACK OF CARD */}
      <div style={{ width: '600px', height: '380px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden', position: 'relative', border: '1px solid #ccc', padding: '24px', display: 'flex', flexDirection: 'column' }}>
         <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '16px', fontStyle: 'italic' }}>
           This card establishes the identity of the specimen in the National Banana Registry. It is a fictional document.
         </div>

         <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
           <div style={{ flex: 1 }}>
             <div style={{ marginBottom: '16px' }}>
               <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>BananaPrint ID</div>
               <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{banana.bananaPrintId || 'PENDING ANALYSIS'}</div>
             </div>
             <div style={{ marginBottom: '16px' }}>
               <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Scientific Classification</div>
               <div style={{ fontWeight: 'bold' }}>{banana.scientificClassification || 'Musa spp.'}</div>
             </div>
             <div style={{ marginBottom: '16px' }}>
               <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Registry Status</div>
               <div style={{ fontWeight: 'bold', color: 'var(--status-green)' }}>{banana.registryStatus}</div>
             </div>
           </div>

           <div style={{ width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
             <div style={{ textAlign: 'center' }}>
               <div style={{ width: '100px', height: '100px', backgroundColor: '#000', padding: '4px' }}>
                  {/* Fake QR visual block */}
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px' }}>
                    {Array.from({ length: 25 }).map((_, i) => <div key={i} style={{ backgroundColor: ((i * 13) % 17) > 8 ? '#000' : '#fff' }} />)}
                  </div>
               </div>
               <div style={{ fontSize: '0.6rem', marginTop: '4px', fontFamily: 'monospace' }}>VERIFY</div>
             </div>
             <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Issue Date</div>
               <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{new Date(document.issueDate).toLocaleDateString()}</div>
               <div style={{ fontSize: '0.6rem', color: 'var(--text-light)', marginTop: '4px' }}>{document.documentNumber}</div>
             </div>
           </div>
         </div>

         <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
           <div style={{ fontSize: '0.7rem', color: 'var(--gov-blue)' }}>
             <strong>Authorized Digital Record</strong><br/>
             National Banana Registry
           </div>
           <div style={{ fontSize: '1.2rem', fontFamily: 'cursive', color: 'var(--gov-blue)' }}>NBRegistry</div>
         </div>
      </div>

    </div>
  );
}
