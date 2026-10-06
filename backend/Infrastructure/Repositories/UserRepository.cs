using Backend.Domain;
using Backend.Domain.Repositories;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Users
            .Include(u => u.UserAreas)
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _context.Users
            .Include(u => u.UserAreas)
            .ToListAsync(cancellationToken);

    public async Task<User> AddAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task Update(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task Delete(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Remove(user);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Users.AnyAsync(u => u.Id == id, cancellationToken);
}