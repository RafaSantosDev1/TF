using Backend.Application.DTOs.User;
using Backend.Domain;
using Backend.Domain.Enums;
using Backend.Domain.Repositories;

namespace Backend.Application.Services;

public class UserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.GetAllAsync(cancellationToken);
        return users.Select(ToDto);
    }

    public async Task<UserDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken);
        return user is null ? null : ToDto(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto, CancellationToken cancellationToken = default)
    {
        var user = new User
        {
            Name = dto.Name,
            ProfileImage = dto.ProfileImage,
            Bio = dto.Bio
        };

        foreach (var area in dto.Areas.Distinct())
        {
            user.UserAreas.Add(new UserArea
            {
                Area = area
            });
        }

        await _userRepository.AddAsync(user, cancellationToken);
        return ToDto(user);
    }

    public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken);
        if (user is null)
        {
            return null;
        }

        user.Name = dto.Name;
        user.ProfileImage = dto.ProfileImage;
        user.Bio = dto.Bio;

        var areas = dto.Areas.Distinct().ToList();

        var areasToRemove = user.UserAreas
            .Where(ua => !areas.Contains(ua.Area))
            .ToList();

        foreach (var userArea in areasToRemove)
        {
            user.UserAreas.Remove(userArea);
        }

        foreach (var area in areas)
        {
            if (!user.UserAreas.Any(ua => ua.Area == area))
            {
                user.UserAreas.Add(new UserArea
                {
                    Area = area
                });
            }
        }

        await _userRepository.Update(user, cancellationToken);
        return ToDto(user);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken);
        if (user is null)
        {
            return false;
        }

        await _userRepository.Delete(user, cancellationToken);
        return true;
    }

    private static UserDto ToDto(User user) => new()
    {
        Id = user.Id,
        Name = user.Name,
        ProfileImage = user.ProfileImage,
        Bio = user.Bio,
        Areas = user.UserAreas.Select(ua => ua.Area).ToList()
    };
}